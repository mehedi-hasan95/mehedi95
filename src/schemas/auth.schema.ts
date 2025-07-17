import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Password is required",
  }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be atleast 4 characters long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(4, { message: "Your password must be atleast 4 characters long" })
      .max(64, {
        message: "Your password can not be longer then 64 characters long",
      }),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string({ message: "current password is required" }),
    password: z
      .string()
      .min(4, { message: "Your password must be atleast 4 characters long" })
      .max(64, {
        message: "Your password can not be longer then 64 characters long",
      }),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  password: z.string({ message: "Password is required" }),
  otp: z.string({ message: "OTP is required" }),
});

export const createProjectSchema = z.object({
  title: z.string().min(5, { message: "Project title is required" }),
  description: z
    .string()
    .min(10, { message: "Project description is required" }),
  keyChallenge: z
    .string()
    .min(10, { message: "Write your key challenge" })
    .optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
  }),
  liveDemo: z.string(),
  githubLink: z.string(),
  technologyUsed: z.array(z.string()).nonempty("Please at least one item"),
  isFeatured: z.boolean(),
  featuredImage: z.string(),
  gallery: z.array(z.string()),
});
