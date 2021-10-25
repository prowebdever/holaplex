import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, FormInstance, PageHeader, Space } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import { MintAction } from 'pages/nfts/new';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  dispatch: (payload: MintAction) => void;
  form: FormInstance;
  // index: number;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 216px;
  column-gap: 16px;
  row-gap: 16px;
  max-height: 500px;
`;

const InnerContainer = styled.div`
  display: flex;
`;

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 48px;
  line-height: 65px;
  text-align: center;
  width: 701px;
  margin-top: 102px;
  color: #fff;
`;

export default function Summary({
  previousStep,
  goToStep,
  images,
  nextStep,
  dispatch,
  form,
}: Props) {
  const handleNext = () => {
    nextStep!();
  };

  const upload = async () => {
    console.log('uploading images', images);
    const body = new FormData();

    images.forEach((i) => body.append(i.name, i, i.name));

    console.log('DEBUG: post body for images', [...body]);
    const resp = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body,
    });

    const uploadedFilePins = await resp.json();
    // const uploadedFilePins = {
    //   files: [
    //     {
    //       uri: 'https://bafkreihoddhywijzgytw7tocwilq7bnuvdbm3cu5t2wass3f7ce6whv3qm.ipfs.dweb.link',
    //       name: 'image 8.png',
    //       type: 'image/png',
    //     },
    //   ],
    // };

    console.log('DEBUG RESP', uploadedFilePins);
    console.log('json resp is', JSON.stringify(uploadedFilePins));
    dispatch({ type: 'UPLOAD_FILES', payload: uploadedFilePins.files });
    form.submit();
  };

  return (
    <NavContainer title="Summary" previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <InnerContainer>
        <Button onClick={upload}>Looks good</Button>
        <Grid>
          {images.map((image) => (
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(image)}
              alt={image.name}
              unoptimized={true}
              key={image.name}
            />
          ))}
        </Grid>
      </InnerContainer>
    </NavContainer>
  );
}
