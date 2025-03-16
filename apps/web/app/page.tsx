import HomeComponent from '@/components/HomeComponent';
import RedirectIfNotAuth from '@/components/RedirectIfNotAuth';

export default function Home() {
  return (
    <>
      <RedirectIfNotAuth />
      <div className='flex flex-col items-center justify-center min-h-screen bg-stone-900'>
        <HomeComponent />
      </div>
    </>
  );
}
