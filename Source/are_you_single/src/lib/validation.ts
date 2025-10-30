
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