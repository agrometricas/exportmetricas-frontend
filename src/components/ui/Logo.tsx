import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useExporter } from '../../hooks/useUserProfile';

interface LogoProps {
  width?: number;
  height?: number;
  align?: 'center' | 'left' | 'right';
}

export const Logo = ({
  width = 40,
  height = 40,
  align = 'center',
}: LogoProps): React.JSX.Element => {
  const { user, isLoading } = useExporter();
  const logoSrc =
    user?.exporterDetails?.logoUrl && !isLoading
      ? user.exporterDetails.logoUrl
      : '/Banana.png';

  const justifyContentMap = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end',
  } as const;

  return (
    <Box
      display='flex'
      justifyContent={justifyContentMap[align]}
      alignItems='center'
    >
      <Image width={width} height={height} src={logoSrc} alt='logo' />
    </Box>
  );
};
