import React from "react";

export default function About() {
  return (
    <section className="py-20 px-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">About MealMitra</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          MealMitra is a community-driven platform that connects people who love to share meals.
          Our mission is to reduce food waste while fostering a culture of generosity and social responsibility.
          Users can register as either donors or receivers, making it simple for anyone to contribute 
          to their community in a meaningful way.

          <br /><br />
          Donors can post details about the type of food they are offering—whether prepared meals, 
          fresh produce, or packaged items—along with quantity and expiry information. Receivers 
          can search for available food donations, filter by type, and indicate the number of people 
          they need to feed. By connecting donors and receivers in a safe, efficient, and transparent 
          way, MealMitra strengthens local communities and promotes sustainable food sharing.

          <br /><br />
          The platform also encourages community engagement through features like recipes, food events, 
          and workshops, making it not just a tool for sharing meals, but a hub for learning, collaboration, 
          and social interaction around food.
        </p>
      </div>
    </section>
  );
}
