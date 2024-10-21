'use client';
import BlancProductsCards from '@/components/BlancProductsCards';
import BlancIntro from '@/components/BlancIntro';

const BlancPage = () => {
  return (
    <div className='text-center relative px-16'>
      <br /><br /><br />
      <br /><br />
      <video
        src="/videos/minibanner.mp4"
        width={1920}
        height={400}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`w-full h-[400px] object-fit`}
      >
        Your browser does not support the video tag.
      </video>
      <BlancIntro />
      <div className="border-b-4 border-orange-600 w-full md:w-[70rem] my-2 md:my-4 slide-in-right"></div>
      <br />
      <BlancProductsCards />
      <br /><br />
    </div>
  );
};

export default BlancPage;
