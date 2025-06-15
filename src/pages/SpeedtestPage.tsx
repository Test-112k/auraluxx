
import MainLayout from '@/components/layout/MainLayout';

const SpeedtestPage = () => {
  return (
    <MainLayout>
      <div className="auraluxx-container pb-8 flex flex-col flex-grow">
        <div className="text-center my-8 shrink-0">
          <h1 className="text-4xl font-bold text-white mb-4">Internet Speed Test</h1>
          <p className="text-white/70 text-lg">
            Powered by LibreSpeed, an open-source speed test.
          </p>
        </div>
        <div className="flex-grow rounded-lg overflow-hidden border border-white/10 shadow-lg min-h-[60vh]">
          <iframe
            src="https://librespeed.org/"
            className="w-full h-full border-0"
            title="LibreSpeed Speed Test"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpeedtestPage;
