import { DoctorConsole } from '@/components/doctor/DoctorConsole';
import { Helmet } from 'react-helmet-async';

const Doctor = () => {
  return (
    <>
      <Helmet>
        <title>Doctor Console | SPARC</title>
        <meta name="description" content="Review AI-generated treatment recommendations for oncology patients" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <DoctorConsole />
    </>
  );
};

export default Doctor;
