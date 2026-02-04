import React from 'react';
import { Link } from 'react-router-dom';

export const HeaderLogo = () => {
  return (
    <section className=''>
      <Link to='/' className='flex items-center lg:text-2xl text-lg sm:text-2xl font-semibold italic'>BookNest</Link>
    </section>

  );
};
