export type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const DEFAULT_TITLE = "Gold Models | Oportunidades Remotas";
const DEFAULT_DESCRIPTION =
  "Aplica hoy con Gold Models a oportunidades profesionales remotas. Proceso rápido, pagos transparentes y soporte continuo para mayores de 18 años.";
const DEFAULT_IMAGE = "/images/logo-coral.svg";

export const buildSeo = (props: SeoProps = {}) => {
  const title = props.title ?? DEFAULT_TITLE;
  const description = props.description ?? DEFAULT_DESCRIPTION;
  const image = props.image ?? DEFAULT_IMAGE;
  const url = props.url;

  return { title, description, image, url };
};

export const seoDefaults = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_IMAGE,
};
