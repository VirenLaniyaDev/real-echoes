import * as React from "react";
import {
  Html,
  Head,
  Tailwind,
  Body,
  Preview,
  Img,
  Heading,
  Text,
  Container,
  Section,
  Hr,
} from "@react-email/components";

interface VerifyEmailTemplateProps {
  username: string;
  verifyCode: string;
}

export function VerifyEmailTemplate({
  username,
  verifyCode,
}: VerifyEmailTemplateProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Real Echoes - Email verification code</Preview>
      <Tailwind>
        <Body className="bg-white font-sans my-auto mx-auto px-2">
          <Container className="border border-solid border-[#eaeaea] rounded-lg p-5 my-10 mx-auto max-w-[465px]">
            <Heading className="text-center text-black text-2xl my-8">
              Verify your Email
            </Heading>
            <Text className="text-black">Hello {username},</Text>
            <Text className="text-black">
              You recently requested to confirm your email associated with your
              insMind account. If you did not make this request, please ignore
              this email.
            </Text>
            <Text className="text-black text-center text-lg">
              Here is your verification code
            </Text>
            <Text className="text-black text-center text-xl font-bold tracking-[8px]">
              {verifyCode}
            </Text>
            <Hr />
            <Section className="mt-8">
              <Img
                src="http://localhost:3000/images/real-echoes_wordmark.png"
                alt="Real Echoes"
                className="w-[50%] mx-auto"
              />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerifyEmailTemplate;
