export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-10">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} MealMitra. All rights reserved.
      </p>
    </footer>
  );
}
