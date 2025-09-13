import { supabase } from "../../database/supabase.js";

class AuthController {
  static userRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
      //Check if username exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      console.log(existingUser);
      if (existingUser) {
        throw new Error("Username already exists");
      }

      //Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        email_verified: true,
        options: {
          data: {
            display_name: username,
          },
        },
      });
      if (authError) throw authError;

      const userId = authData.user.id;

      //store username in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: userId, username, email }]);
      if (profileError) throw profileError;

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;

      const access_token = loginData.session.access_token;
      const user = loginData.session.user;
      const refresh_token = loginData.session.refresh_token;


      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(201).json({ message: "User signed up!", user, access_token });
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  };

  static userLogin = async (req, res) => {
    const { identifier, password } = req.body;

    try {
      let emailToUse = identifier;

      //if user input username
      if (!identifier.includes("@")) {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .single();
        if (error || !data) throw new Error("Invalid Username");
        emailToUse = data.email;
      }

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: emailToUse,
          password,
        });

      if (authError) throw authError;

      const access_token = authData.session.access_token;
      const refresh_token = authData.session.refresh_token;


      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 1,
      });

      res.status(200).json({ message: "Logged in!", user: authData.session.user, access_token });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error.message || error });
    }
  };

  static userLogout = async (req,res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  };

  static getUser = async (req,res) => {
    try {
      const {data:profile, error} = await supabase
      .from("profiles")
      .select("id, username, email")
      .eq("id", req.user.id)
      .single();
      if(error) throw error
      res.status(200).json({user:profile})
    } catch (error) {
       res.status(400).json({error: error.message || error})
    }
  }

  static refreshToken = async(req,res) => {
    
    try {
      const token = req.cookies["refresh_token"];
      const {data, error} = await supabase.auth.refreshSession({refresh_token: token});
      

      if (error) throw error;

      res.cookie("refresh_token", data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 1,
      });

      res.status(200).json({message: "Token Refreshed", access_token: data.session.access_token});
    }catch(error){

      res.status(400).json({error: error.message || error})
    }
  }
}

export default AuthController;
