import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AvatarGenerator } from 'random-avatar-generator';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { auth, firestore } from '../lib/fitebase';
import { type RegisterSchema, registerSchema } from '../schemas/auth.schema';

export default function Register() {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      avatarUrl: '',
      username: '',
    },
    mode: 'onSubmit',
  });

  function generateRandomAvatar() {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  }

  function handleRefreshAvatar() {
    const avatar = generateRandomAvatar();
    setAvatarUrl(avatar);
  }

  useEffect(() => {
    const avatar = generateRandomAvatar();
    setAvatarUrl(avatar);
  }, [setAvatarUrl]);

  useEffect(() => {
    if (avatarUrl) {
      setValue('avatarUrl', avatarUrl);
    }
  }, [setValue, avatarUrl]);

  async function onSubmit(data: RegisterSchema) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        username: data.username,
        uid: user.uid,
        email: data.email,
        avatarUrl: data.avatarUrl,
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to create account', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen p-10 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-2xl h-max shadow-md p-4 rounded-lg border text-primary"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <div className="space-y-2">
          <label htmlFor="username" className="label text-sm font-semibold">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            {...register('username')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="label text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="label text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register('password')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="label text-sm font-semibold"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 justify-between">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-18 h-18 rounded-full"
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleRefreshAvatar}
          >
            New Avatar
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            'Register'
          )}
        </button>
        <span className="text-sm text-center text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}
