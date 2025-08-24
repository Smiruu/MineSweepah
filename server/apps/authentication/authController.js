import {supabase} from "../../database/supabase.js"

class AuthController {
  static userRegister = async (req, res) => {
    const { username,email, password } = req.body;

    try{
        //Create user in Supabase Auth
        const{data: authData, error: authError} = await supabase.auth.signUp({
            email,
            password,
            email_verified: true
        });
        if(authError) throw authError;

        const userId = authData.user.id;

        //store username in profiles table
        const {data: profileData, error: profileError} = await supabase
        .from("profiles")
        .insert([{id: userId, username, email}]);

            if (profileError) throw profileError;

    res.status(201).json({ message: "User signed up!", user: authData.user });
    }catch(error){
        res.status(400).json({ error: error.message || error });
    }

  };

  static userLogin = async (req,res) => {

    const {identifier, password} = req.body;
    

    try {
        let emailToUse = identifier;    
        console.log(identifier)
        //if user input username
        if(!identifier.includes("@")){
            const {data, error} = await supabase
            .from("profiles")
            .select("email")
            .eq("username", identifier)
            .single();
            console.log("Supabase query result:", { data, error });
            if (error|| !data) throw new Error("Invalid Username")
            emailToUse = data.email
        }

        const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password,
        });

        if (authError) throw authError
        res.status(200).json({ message: "Logged in!", session: authData.session });
    } catch (error) {
        res.status(400).json({ error: error.message || error });
    }
  }
    static userLogout = async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  };
}

export default AuthController;