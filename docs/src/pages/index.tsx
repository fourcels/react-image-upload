import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { ImageUpload } from "react-image-upload";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <div className="container margin-vert--md">
          <ImageUpload
            max={3}
            value={[
              "/img/docusaurus.png",
              { url: "/img/docusaurus-social-card.jpg", name: "docusaurus" },
            ]}
            onChange={(value) => console.log(value)}
            onUpload={async (file) => {
              return new Promise((resovle) => {
                setTimeout(() => {
                  resovle(URL.createObjectURL(file));
                }, 1000 * getRandomInt(5));
              });
            }}
          />
          <ImageUpload
            value={[
              "/img/docusaurus.png",
              "/img/docusaurus.png",
              "/img/docusaurus.png",
              "/img/docusaurus.png",
              "/img/docusaurus.png",
              "/img/docusaurus.png",
              { url: "/img/docusaurus-social-card.jpg", name: "docusaurus" },
            ]}
            readonly
            photoProviderProps={{
              maskOpacity: 0.6,
            }}
          />
        </div>
      </main>
    </Layout>
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
