'use client'
import React, { Suspense } from 'react'
import CustomSlider from '@/components/CustomSlider';
import { useState , useEffect } from 'react';
import { Slidebanner } from '@/types/banner';
import { Skeleton } from '@nextui-org/react';

const dummydata = [
  {
    id: 1,
    url: '/',
    imgUrl: '1.jpg',
    imgAlt: '1',
  },
  {
    id: 2,
    url: '/',
    imgUrl: '2.jpg',
    imgAlt: '2',
  },
  {
    id: 3,
    url: '/',
    imgUrl: '3.jpg',
    imgAlt: '3',
  }
]

const MainBanner = () => {
  const [banner , setBanner] = useState<Slidebanner[] | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try { 
        const response = await fetch('https://652c497bd0d1df5273ef56a5.mockapi.io/api/v1/banner' , {
      method : 'GET',
      headers : { 'Content-Type' : 'application/json'}
    })
    if (response.ok) {
      const data = await response.json()
      console.log('Success fecting data:', data)
      setBanner(data)
    }
    } catch (error) {
      console.error('Error fecting data:', error)
    }
  }
    fetchBanner();
  }
  , [])

  // console.log('f d:' , banner)

  if (banner === null) {
    return null; // 데이터가 로딩 중일 때 렌더링을 방지
  }
  
  return (
    <>
        <div className='pt-5'>
          {banner ? (<CustomSlider data={dummydata} />)
          :
          (<Skeleton className='rounded-lg h-[100%] w-full'/>)
          }
        </div>
    </>
  )
}
export default MainBanner