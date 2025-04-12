import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  isSecondSpaceMember: boolean;
  username: string;
  // Add other user properties as needed
}

export const useUser = () => {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Fetch additional user data from your users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        isSecondSpaceMember: userData.isSecondSpaceMember || false,
        username: userData.username,
        // Map other user properties as needed
      };
    },
  });

  return {
    user,
    isLoading,
    error,
  };
}; 