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
  keyFeature: z.array(z.string().nonempty("Please add atleast one feature")),
  challenge: z.array(
    z.object({
      challengeTitle: z.string(),
      challenge: z.string(),
      description: z.string(),
    })
  ),
  duration: z.coerce.number().positive(),
  subTitle: z.string().optional(),
  projectType: z.string(),
  developerRole: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Your name is required" }),
  email: z.string().email().min(2, { message: "Email is required" }),
  subject: z.string().min(2, { message: "Add atleast 2 words" }).optional(),
  message: z.string().min(2, { message: "Message is required" }),
});

export const aboutMeSchema = z.object({
  heading: z.string(),
  bio: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  fiverr: z.string().optional(),
  upwork: z.string().optional(),
  image: z.string().optional(),
  resume: z.string(),
});

export const skillsSchema = z.object({
  skills: z.array(
    z.object({
      title: z.string(),
      skill: z.array(z.string()).refine((arr) => arr.length > 0, {
        message: "Please add at least one skill",
      }),
    })
  ),
});
