
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email('Email không hợp lệ'),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginData = z.infer<typeof loginSchema>;


export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Tên là bắt buộc' })
      .min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z
      .string({ required_error: 'Email là bắt buộc' })
      .email('Email không hợp lệ'),
    password: z
      .string({ required_error: 'Mật khẩu là bắt buộc' })
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z
      .string({ required_error: 'Vui lòng xác nhận mật khẩu' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'], 
  });

export type RegisterData = z.infer<typeof registerSchema>;

const locationSchema = z.object({
  type: z.enum(["Point"]).default("Point"),
  coordinates: z.array(z.number()).length(2, "Tọa độ phải có 2 giá trị"),
}).optional();

export const updateProfileSchema = z.object({
  phone: z
    .string()
    .optional()
    .or(z.literal('')), 
    
  status: z.boolean().optional(),
  location: locationSchema,

  name: z
    .string({ required_error: 'Tên là bắt buộc' })
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  aboutMe: z
    .string()
    .optional()
    .or(z.literal('')),
  dob: z
    .date({ invalid_type_error: 'Ngày sinh không hợp lệ' })
    .nullable() 
    .optional(),
  
  education: z
    .string()
    .optional()
    .or(z.literal('')),
  height: z
    .string()
    .refine((val) => val === "" || /^\d+$/.test(val), {
      message: "Chiều cao phải là một số nguyên (cm)",
    })
    .optional()
    .or(z.literal('')),
  interested: z.array(z.string()).optional(),

  photos: z.array(z.string()).optional(),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;