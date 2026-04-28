"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import type { Branch } from "@/types";
import type { CreateBranchInput } from "@/lib/api/branches";

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateBranchInput) => Promise<void>;
  branch?: Branch | null;
}

export function BranchDialog({ open, onOpenChange, onSave, branch }: BranchDialogProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(branch?.name ?? "");
      setLocation(branch?.location ?? "");
    }
  }, [open, branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), location: location.trim() });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{branch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle>
          <DialogDescription>
            {branch ? "Actualiza los datos de la sucursal." : "Ingresa los datos de la nueva sucursal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="branch-name">Nombre</FieldLabel>
              <Input
                id="branch-name"
                placeholder="Ej. Sucursal Norte"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="branch-location">Ubicación</FieldLabel>
              <Input
                id="branch-location"
                placeholder="Ej. Blvd. Kino #123"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : branch ? "Guardar cambios" : "Crear sucursal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
