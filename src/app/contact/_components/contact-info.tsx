"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SocialLinks } from "@/components/common/social-links";

export const ContactInfo = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.myInfo.queryOptions());
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: data[0]?.email,
      href: `mailto:${data[0]?.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: data[0]?.phone,
      href: `tel:${data[0]?.phone}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: data[0]?.location,
      href: "#",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!data) {
    return <div>No Data</div>;
  }
  return (
    <motion.div
      ref={ref}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold mb-4 text-white">
          {data[0]?.heading}
        </h3>
        <p className="text-gray-300 mb-6">{data[0]?.bio}</p>
      </motion.div>

      <div className="space-y-4">
        {contactMethods.map((method, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass-effect border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
              <CardContent className="px-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <method.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{method.label}</p>
                    <Link
                      href={method.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      {method.value}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <h4 className="font-semibold mb-4 text-white">Follow me</h4>
        <SocialLinks data={data[0]} />
      </motion.div>
    </motion.div>
  );
};
