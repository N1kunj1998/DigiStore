import { ProductCard } from "./ProductCard";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "pdf" | "video" | "workbook";
  image: string;
}

interface ProductRecommendationsProps {
  currentProductId: string;
  currentProductType: "pdf" | "video" | "workbook";
}

const products: Product[] = [
  {
    id: "1",
    title: "Atomic Habits - Complete Summary",
    description: "Master the art of habit formation with this comprehensive summary of James Clear's bestseller",
    price: 9.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Deep Work Mastery Course",
    description: "5-hour video course on implementing Cal Newport's deep work principles in your daily life",
    price: 49.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Productivity Workbook 2024",
    description: "Interactive workbook with exercises, templates, and frameworks for peak productivity",
    price: 19.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Thinking Fast and Slow - Key Insights",
    description: "Essential takeaways from Daniel Kahneman's groundbreaking work on decision-making",
    price: 12.99,
    type: "pdf" as const,
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Communication Skills Masterclass",
    description: "Complete video training on effective communication in business and personal relationships",
    price: 59.99,
    type: "video" as const,
    image: "/placeholder.svg",
  },
  {
    id: "6",
    title: "Goal Setting & Achievement Workbook",
    description: "Proven frameworks and exercises to set meaningful goals and achieve them consistently",
    price: 24.99,
    type: "workbook" as const,
    image: "/placeholder.svg",
  },
];

export const ProductRecommendations = ({ currentProductId, currentProductType }: ProductRecommendationsProps) => {
  const navigate = useNavigate();

  // Get related products (same type, excluding current product)
  const relatedProducts = products
    .filter(product => product.id !== currentProductId && product.type === currentProductType)
    .slice(0, 3);

  // If not enough same-type products, fill with other products
  if (relatedProducts.length < 3) {
    const otherProducts = products
      .filter(product => product.id !== currentProductId && product.type !== currentProductType)
      .slice(0, 3 - relatedProducts.length);
    relatedProducts.push(...otherProducts);
  }

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
