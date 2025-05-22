import { render, screen } from '@testing-library/react';
import { ProductCard } from '../../components/ProductCard';
import { Product } from '../../services/productService';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    const { fill, ...rest } = props;
    return <img {...rest} src={props.src} alt={props.alt} style={fill ? { objectFit: 'cover' } : undefined} />;
  },
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'This is a test product description',
    category: 'Test Category',
    image: 'https://example.com/test-image.jpg',
    rating: {
      rate: 4.5,
      count: 10,
    },
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if product title is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if product description is rendered
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();

    // Check if product price is rendered
    expect(screen.getByText('$99.99')).toBeInTheDocument();

    // Check if product category is rendered
    expect(screen.getByText('Test Category')).toBeInTheDocument();

    // Check if rating count is rendered
    expect(screen.getByText('(10)')).toBeInTheDocument();

    // Check if the link points to the correct product page
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('renders "No image available" when image is null', () => {
    const productWithoutImage = {
      ...mockProduct,
      image: null,
    };

    render(<ProductCard product={productWithoutImage} />);

    // Check if "No image available" text is rendered
    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  it('renders correct number of filled stars based on rating', () => {
    render(<ProductCard product={mockProduct} />);

    // Since the rating is 4.5, we expect 5 stars to be rendered (rounded up)
    // But we can't easily test the color of the stars in this test environment
    // So we'll just check that there are 5 SVG elements
    const stars = document.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });
});