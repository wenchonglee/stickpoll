import { Anchor, Image } from "@mantine/core";
import GithubLogo from "../img/github.png";

export const GithubLink = () => (
  <Anchor href="https://github.com/wenchonglee/stickpoll">
    <Image src={GithubLogo} width={20} height={20} />
  </Anchor>
);
