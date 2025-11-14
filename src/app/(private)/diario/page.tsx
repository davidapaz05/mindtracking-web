"use client";

import React, { Suspense } from "react";
import DiarioClient from "./DiarioClient";

export default function DiarioPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <DiarioClient />
    </Suspense>
  );
}
