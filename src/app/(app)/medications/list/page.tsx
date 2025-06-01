
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Medication } from "@/lib/types";
import { Pill, Edit3, Trash2, PlusCircle, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

// Default mock data - used if localStorage is empty
const defaultInitialMedications: Medication[] = [];

export default function MedicationsListPage() {
  const [isClient, setIsClient] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsLoading(true);
      const storedMedicationsString = localStorage.getItem('pillPalMedications');
      if (storedMedicationsString) {
        setMedications(JSON.parse(storedMedicationsString));
      } else {
        setMedications(defaultInitialMedications);
        localStorage.setItem('pillPalMedications', JSON.stringify(defaultInitialMedications.map(m => {
          const { icon, ...rest } = m; return rest;
        })));
      }
      setIsLoading(false);
    }
  }, [isClient]);

  // Save medications to localStorage when they change
  useEffect(() => {
    if (isClient && !isLoading) { // Only save after initial load
      localStorage.setItem('pillPalMedications', JSON.stringify(medications.map(m => {
        const { icon, ...rest } = m; return rest;
      })));
    }
  }, [medications, isClient, isLoading]);


  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.dosage && med.dosage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteMedication = (id: string) => {
    setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
  };

  if (isLoading && isClient) {
    return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="ml-4 text-xl text-muted-foreground">Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Pill className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-headline">Your Medications</CardTitle>
            </div>
            <Link href="/medications/add" passHref>
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Medication
              </Button>
            </Link>
          </div>
          <CardDescription className="mt-2">
            Manage your list of medications. Keep it up-to-date for accurate reminders and tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search medications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredMedications.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Times</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((med) => (
                    <TableRow key={med.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium py-3">{med.name}</TableCell>
                      <TableCell className="py-3">{med.dosage}</TableCell>
                      <TableCell className="py-3 capitalize">{med.frequency.replace('_', ' ')}</TableCell>
                      <TableCell className="py-3">{med.times.join(', ') || 'N/A'}</TableCell>
                      <TableCell className="py-3">{med.startDate ? format(new Date(med.startDate), 'PPP') : 'N/A'}</TableCell>
                      <TableCell className="py-3">{med.endDate ? format(new Date(med.endDate), 'PPP') : 'N/A'}</TableCell>
                      <TableCell className="text-right py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled>
                              Edit (Not implemented)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive px-2 py-1.5 h-auto text-sm relative">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the medication "{med.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMedication(med.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
               <Image src={searchTerm ? "https://placehold.co/300x220.png" : "https://placehold.co/300x250.png"} alt={searchTerm ? "No medications match search" : "No medications added"} width={searchTerm ? 300 : 250} height={searchTerm ? 220 : 200} className="mx-auto mb-6 rounded-lg" data-ai-hint={searchTerm ? "empty search results" : "empty state pills"} />
              <p className="text-xl text-muted-foreground mb-2">
                {searchTerm ? "No Medications Found" : "No Medications Yet"}
              </p>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search or add a new medication." : "You haven't added any medications yet. Add one to get started!"}
              </p>
              {!searchTerm && (
                <Link href="/medications/add" passHref>
                  <Button>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Medication
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
        {filteredMedications.length > 0 && (
            <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                Showing {filteredMedications.length} of {medications.length} medication(s).
                </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
