'use client'; // Add this if you're using Next.js server components

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';
import FormInput from '@/components/form/FormInput';

const createProductAction = async (formData: FormData) => {
  const name = formData.get('name') as string;
  console.log(name);
};

function CreateProductPage() {
  const name = faker.commerce.productName();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.currentTarget);
    await createProductAction(formData);
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Create Product</h1>
      <div className="border p-8 rounded-md">
        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="name"
            label="product name"
            defaultValue={name}
          />
          <Button type="submit" size="lg">
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateProductPage;
