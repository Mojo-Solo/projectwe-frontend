"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, X, Lightbulb, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContextualHelp } from "./ContextualHelp";

interface FloatingHelpButtonProps {
  currentTab: string;
  hasCompletedDemo: boolean;
  hasEnteredInfo: boolean;
  hasCalculatedValue: boolean;
  onOpenGuide: () => void;
}

export function FloatingHelpButton({
  currentTab,
  hasCompletedDemo,
  hasEnteredInfo,
  hasCalculatedValue,
  onOpenGuide,
}: FloatingHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Help Content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Help & Guidance
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-2 mb-6">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      onOpenGuide();
                      setIsOpen(false);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Complete Tutorial
                  </Button>
                </div>

                {/* Contextual Help */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Help for Current Page</h3>
                  <ContextualHelp
                    currentTab={currentTab}
                    hasCompletedDemo={hasCompletedDemo}
                    hasEnteredInfo={hasEnteredInfo}
                    hasCalculatedValue={hasCalculatedValue}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
