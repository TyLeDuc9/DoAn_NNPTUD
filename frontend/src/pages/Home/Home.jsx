import React from 'react'
import { Banner } from '../../components/Banner/Banner'
import { Title } from '../../components/Title/Title'
import { LatestBook } from '../../components/TopBook/LatestBook'
import banner_home_pro_3 from '../../assets/banner/banner_home_pro_3.jpg'
import banner_home_pro_4 from '../../assets/banner/banner_home_pro_4.jpg'
import { useLoadingEffect } from '../../hooks/useLoadingEffect';
import banner5 from '../../assets/banner/banner5.jpg'
import { CategoryBook } from '../../components/TopBook/CategoryBook'
import { RandomBook } from '../../components/TopBook/RandomBook'
import { BlogBook } from '../../components/TopBook/BlogBook'
export const Home = () => {
  useLoadingEffect(500);
  return (

    <div className=''>
      <Banner />
      <Title title='Sách mới' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <LatestBook />
      <Title title='Đề xuất hôm nay' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <RandomBook />
      <img src={banner_home_pro_3} className='w-[85%] mx-auto' />
      <Title title='Văn học nước ngoài' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <CategoryBook id="68a27893b6d35b8c9afbbb07" slug="van-hoc-nuoc-ngoai" />
      <img src={banner_home_pro_4} className='w-[85%] mx-auto' />
      <Title title='Truyện tranh' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <CategoryBook id="68a278acb6d35b8c9afbbb0a" slug="truyen-tranh" />
      <CategoryBook id="68a278acb6d35b8c9afbbb0a" slug="truyen-tranh" />
      {/* <img src={banner_home_pro_6} className='w-[85%] mx-auto'/> */}
      <img src={banner5} className='w-[85%] mx-auto' />
      <Title title='Văn học Việt Nam' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <CategoryBook id="68a2787fb6d35b8c9afbbb04" slug="van-hoc-viet-nam" />
      <Title title='Kinh tế' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <CategoryBook id="68c2c181397736d828572e37" slug="kinh-te" />
      <Title title='Giới thiệu về sách' className='lg:text-3xl sm:text-2xl text-center lg:my-8 my-4 font-semibold' />
      <BlogBook />
    </div>
  )
}
