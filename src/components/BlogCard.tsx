import { Card , type CardProps} from "@/components/Card"
export const BlogCard = (props: Readonly<CardProps>) => {
  console.log("BlogCard props:", props);
  console.log("BlogCard sectors:", props.sectors);

  return <Card {...props} basePath="insights" />;
};