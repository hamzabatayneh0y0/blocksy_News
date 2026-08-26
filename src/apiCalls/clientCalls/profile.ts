import api from "@/lib/axios";
import { updateUserSchema } from "@/utils/validationSchemas";


export async function updateProfile(userId: number, name: string) {
 
  
 try {
   const validation = updateUserSchema.safeParse({
      name
    });
  
    if (!validation.success) {
  
      throw new Error(validation.error.issues[0].message);
    }
  
  const { data } = await api.put(
    `/users/profile/${userId}`,
    { name },
  );

  return data;}catch(error){
    console.log(error)
    throw error
  }
}

export async function updateProfileImage(
  userId: number,
  image: File,
) {
  const formData = new FormData();

  formData.append("image", image);

  const { data } = await api.put(
    `/users/profile/${userId}/image`,
    formData,
  );

  return data;
}

export async function deleteProfile(userId: number) {
  const { data } = await api.delete(
    `/users/profile/${userId}`,
  );

  return data;
}

export async function getUserActivities(
  userId: number,
  type: "bookmarks" | "articleLikes" | "comments",
  pageNumber: number,
) {
  const { data } = await api.get(
    `/users/profile/${userId}/activities?type=${type}&pageNumber=${pageNumber}`
   
  );

  return data 
}