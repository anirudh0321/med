
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Medication } from "@/lib/types";
import { Pill, Edit3, Trash2, PlusCircle, Search, Filter } from "lucide-react";
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

// Mock data - replace with API calls in a real app
const initialMedications: Medication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'once_daily', times: ['08:00'], instructions: 'Take with water', adherence: [] },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', times: ['08:00', '20:00'], adherence: [] },
  { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'once_daily', times: ['21:00'], instructions: 'Take before bed', adherence: [] },
  { id: '4', name: 'Amoxicillin', dosage: '250mg', frequency: 'thrice_daily', times: ['07:00', '15:00', '23:00'], adherence: [] },
  { id: '5', name: 'Albuterol', dosage: '2 puffs', frequency: 'as_needed', times: [], instructions: 'For asthma attacks', adherence: [] },
];

export default function MedicationsListPage() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMedication = (id: string) => {
    // Add a confirmation dialog here in a real app
    setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Pill className="h-16 w-16 text-primary animate-spin" />
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
            {/* Future filter button */}
            {/* <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button> */}
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
                            <DropdownMenuItem>
                              {/* <Link href={`/medications/edit/${med.id}`}>Edit</Link> */}
                              Edit (Not implemented)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteMedication(med.id)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              Delete
                            </DropdownMenuItem>
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
              <Image src="https://placehold.co/400x300.png" alt="No medications found" width={300} height={225} className="mx-auto mb-6 rounded-lg" data-ai-hint="empty state search" />
              <h3 className="text-xl font-semibold mb-2">No Medications Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search or add a new medication." : "You haven't added any medications yet."}
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
