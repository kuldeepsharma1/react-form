import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

type FormData = z.infer<typeof schema>;

const BasicForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("firstName")}
        />
        {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
          Last Name:
        </label>
        <input
          type="text"
          id="lastName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("lastName")}
        />
        {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
      </div>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
};

export default BasicForm;
