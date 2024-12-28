export const product = {
  id: "smart-watch-290xt",
  name: "Classy Modern Smart watch",
  model: "Forerunner 290XT",
  type: "Watch",
  description:
    "I must explain to you how all this mistaken idea of denouncing pleasure praising pain was born and I will give you a complete account of the system, and expound the actual teaching.",
  rating: {
    score: 5,
    count: 2,
  },
  pricing: {
    original: 99.0,
    current: 79.0,
    currency: "USD",
  },
  variants: {
    colors: [
      {
        id: "violet",
        name: "Violet",
        bgClass: "bg-violet-500",
        borderColor: "#8b5cf6",
        image: "./assets/1.png",
      },
      {
        id: "teal",
        name: "Teal",
        bgClass: "bg-teal-400",
        borderColor: "#2dd4bf",
        image: "./assets/2.png",
      },
      {
        id: "blue",
        name: "Blue",
        bgClass: "bg-blue-500",
        borderColor: "#3b82f6",
        image: "./assets/3.png",
      },
      {
        id: "black",
        name: "Black",
        bgClass: "bg-zinc-700",
        borderColor: "#3f3f46",
        image: "./assets/4.png",
      },
    ],
    sizes: [
      { id: "S", name: "Small", price: 69 },
      { id: "M", name: "Medium", price: 79 },
      { id: "L", name: "Large", price: 89 },
      { id: "XL", name: "Extra Large", price: 99 },
    ],
  },
};
