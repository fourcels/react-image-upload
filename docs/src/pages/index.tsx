import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { ImageUpload } from "@fourcels/react-image-upload";
import "@fourcels/react-image-upload/dist/index.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero shadow--lw", styles.heroBanner)}>
      <div className="container">
        <div>
          <img
            className={clsx(styles.heroBannerLogo, "margin-vert--md")}
            src="img/logo.png"
          />
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <HomepageHeader />
      <main>
        <div className={styles.example}>
          <ImageUpload
            value={[
              "img/undraw_docusaurus_mountain.svg",
              "img/undraw_docusaurus_react.svg",
              "img/undraw_docusaurus_tree.svg",
            ]}
          />
        </div>
      </main>
    </Layout>
  );
}
