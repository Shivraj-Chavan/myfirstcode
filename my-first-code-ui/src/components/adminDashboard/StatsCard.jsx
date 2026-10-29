import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  icon,
  color,
}) {

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`
        rounded-3xl
        p-6
        shadow-xl
        border
        border-white/10
        bg-gradient-to-br ${color}
        text-white
      `}
    >

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm opacity-80">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div>
          {icon}
        </div>

      </div>

    </motion.div>
  );
}