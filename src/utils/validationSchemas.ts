
import { z } from "zod";

// Create Article Schema
export const createArticleSchema = z.object({
  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title should be of type string",
    })
    .min(2, { message: "title should be at least 2 characters long" })
    .max(200, { message: "title should be less than 200 characters" }),

  description: z
    .string({
      required_error: "description is required",
      invalid_type_error: "description should be of type string",
    })
    .min(10, {
      message: "description should be at least 10 characters long",
    }),

  tags: z
    .array(
      z
        .string({
          invalid_type_error: "tag should be of type string",
        })
        .min(1, { message: "tag should be at least 1 character long" })
        .regex(/^\S+$/, { message: "You can't use spaces in tag" })
    , {
      required_error: "tags is required",
      invalid_type_error: "tags should be an array",
    })
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "Maximum 5 tags allowed" })
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "Tags cannot be duplicated"
    ),
});

// Register Schema
export const registerSchema = z.object({
  username: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username should be of type string",
    })
    .min(2, {
      message: "username should be at least 2 characters long",
    })
    .max(100, {
      message: "username should be less than 100 characters",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "username should only contain letters, numbers and _",
    })
    .regex(/^\S+$/, "you can't use spaces"),

  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email should be of type string",
    })
    .min(3, {
      message: "email should be more than 3 characters",
    })
    .max(200, {
      message: "email should be less than 200 characters",
    })
    .email()
    .regex(/^\S+$/, "you can't use spaces"),

  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "password Must include a lowercase letter")
    .regex(/[A-Z]/, "password Must include an uppercase letter")
    .regex(/[0-9]/,  "password Must include a number")
    .regex(/[^a-zA-Z0-9]/, "password Must include a special character")
    .regex(/^\S+$/, "you can't use spaces"),
});

// Login Schema
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email should be of type string",
    })
    .min(3, {
      message: "email should be more than 3 characters",
    })
    .max(200, {
      message: "email should be less than 200 characters",
    })
    .email()
    .regex(/^\S+$/, "you can't use spaces"),

  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "password Must include a lowercase letter")
    .regex(/[A-Z]/, "password Must include an uppercase letter")
    .regex(/[0-9]/, "password Must include a number")
    .regex(/[^a-zA-Z0-9]/, "password Must include a special character")
    .regex(/^\S+$/, "you can't use spaces"),
});

// Create Comment Schema
export const createCommentSchema = z.object({
  text: z
    .string({
      required_error: "text is required",
      invalid_type_error: "text should be of type string",
    })
    .min(1, {
      message: "text should be at least 2 characters long",
    })
    .max(500, {
      message: "text should be less than 500 characters",
    }),

  articleId: z.number({
    required_error: "articleId is required",
    invalid_type_error: "articleId should be a number",
  }),
    parentId: z.number({
    invalid_type_error: "parentId should be a number",
  }).nullable(),
    rootId: z.number({
    invalid_type_error: "parentId should be a number",
  }).nullable()
});

export const updateCommentSchema = z.object({
  text: z
    .string({
      required_error: "text is required",
      invalid_type_error: "text should be of type string",
    })
    .min(1, {
      message: "text should be at least 2 characters long",
    })
    .max(500, {
      message: "text should be less than 500 characters",
    }),


});

// Update User Profile Schema
export const updateUserSchema = z.object({
  name: z
    .string({
       required_error: "username is required",  
      invalid_type_error: "username should be of type string",
    })
    .min(2, {
      message: "username should be at least 2 characters long",
    })
    .max(100, {
      message: "username should be less than 100 characters",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "username should only contain letters, numbers and _,you can't use spaces",
    })
    .regex(/^\S+$/, "you can't use spaces")
    



});

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email should be of type string",
    })
    .min(3, {
      message: "email should be more than 3 characters",
    })
    .max(200, {
      message: "email should be less than 200 characters",
    })
    .email()
    .regex(/^\S+$/, "you can't use spaces"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^a-zA-Z0-9]/, "Must include a special character")
    .regex(/^\S+$/, "you can't use spaces"),
});

export const updateArticleSchema = z.object({
  title: z
    .string({
      invalid_type_error: "title should be of type string",
    })
    .min(2, {
      message: "title should be at least 2 characters long",
    })
    .max(200, {
      message: "title should be less than 200 characters",
    })
    .optional(),

  description: z
    .string({
      invalid_type_error: "description should be of type string",
    })
    .min(10, {
      message: "description should be at least 10 characters long",
    })
    .optional(),

 
});
export const updateArticleTagsSchema = z.object({

  tags: z
    .array(
      z
        .string({
          invalid_type_error: "tag should be of type string",
        })
        .min(1, {
          message: "tag should be at least 1 character long",
        })
        .regex(/^\S+$/, {
          message: "You can't use spaces",
        })
    , {
           required_error: "tags is required",
      invalid_type_error: "tags should be an array",
    })
    .min(1, {
      message: "At least one tag is required",
    })
    .max(5, {
      message: "Maximum 5 tags allowed",
    })
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "Tags cannot be duplicated"
    )
    
});


export const recommendationsArticlesSchema = z.object({

  tagsParams : z
    .array(
      z
        .string({
          invalid_type_error: "tag should be of type string",
        })
        .min(1, {
          message: "tag should be at least 1 character long",
        })
        .regex(/^\S+$/, {
          message: "You can't use spaces",
        })
    , {
           required_error: "tags are required",
      invalid_type_error: "tags should be an array",
    })
    .min(1, {
      message: "At least one tag is required",
    })
    .max(5, {
      message: "Maximum 5 tags allowed",
    })
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "Tags cannot be duplicated"
    )
    
});

export const autoCompleteTagSchema = z.object({
  tag: z.string({
     required_error: "tag is required",
          invalid_type_error: "tag should be of type string",
        })    
       
        .regex(/^\S*$/, {
          message: "You can't use spaces",
        })
})
 


export   const deleteManyArticlesschema = z.object({
  ids: z.array(z.number().int(),
{required_error: "ids are required",}
).min(1, {
      message: "At least one article is required",
    })
    .max(10, {
      message: "Maximum 5 articles allowed",
    })
});




export const tagsSchema = z
  .array(
    z
      .string({
        invalid_type_error: "tag should be of type string",
      })
      .min(1, {
        message: "tag should be at least 1 character long",
      })
      .regex(/^\S+$/, {
        message: "You can't use spaces in tag",
      }),
    {
      required_error: "tags are required",
      invalid_type_error: "tags should be an array",
    },
  )
  .min(1, {
    message: "At least one tag is required",
  })
  .max(5, {
    message: "Maximum 5 tags allowed",
  })
  .refine(
    (tags) => new Set(tags).size === tags.length,
    "Tags cannot be duplicated",
  );

