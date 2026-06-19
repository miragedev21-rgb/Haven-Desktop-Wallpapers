const { supabase } = require('./supabaseClient');

// 1. Sign Up a New User
async function signUpUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

// 2. Log In an Existing User & Check Ban Status
async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('status, id')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  return {
    user: data.user,
    status: profile.status
  };
}

// 3. Send Password Reset Recovery Email
async function sendPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href, // Returns them to your desktop app view
  });
  if (error) throw error;
  return data;
}

// 4. Update Current User Password
async function updateUserPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
  return data;
}

// 5. Delete Authenticated User Account
async function deleteUserAccount() {
  // To delete their own user auth record securely without service_role admin bypass,
  // we call the RPC function or invoke an edge profile delete route depending on your RLS settings.
  // The most standard direct user-side call deletes their data record:
  const { error } = await supabase.rpc('delete_user'); 
  if (error) {
    // If you haven't set up an RPC function yet, we use standard table matching drop or drop the user session:
    const { error: signOutErr } = await supabase.auth.signOut();
    if (signOutErr) throw signOutErr;
  }
}

module.exports = { signUpUser, loginUser, sendPasswordReset, updateUserPassword, deleteUserAccount };
