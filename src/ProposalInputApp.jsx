import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function ProposalInputApp() {
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    proposalNumber: "",
    proposalDate: "",
    description: "",
    services: "",
    notes: "",
    scope: "",
    exclusions: "",
    outsideServices: "",
    schedule: "",
    feeInfo: "",
    attachments: ""
  });

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const generateDocx = async () => {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const defaultProposalNumber = `P.${yearSuffix}.XXXX`;
    const proposalNumber = formData.proposalNumber || defaultProposalNumber;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: "LKB Engineering PLLC (\"LKB\") Proposal Preview", bold: true, size: 28 })] }),
            new Paragraph({ text: "" }),
            ...["Project Name", "Location", "Proposal Number", "Proposal Date", "Description", "Requested Services", "Scope of Work", "Exclusions", "Outside Services", "Schedule", "Fee Information", "Attachments & Legal", "Notes"].map((label) => (
              [
                new Paragraph({ text: `${label}:`, bold: true }),
                new Paragraph({
                  text: label === "Proposal Number"
                    ? proposalNumber
                    : formData[label.replace(/[^a-zA-Z]/g, '').toLowerCase()] || ""
                }),
                new Paragraph({ text: "" })
              ]
            )).flat()
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${formData.projectName || "Proposal"}-Preview.docx`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-bold mb-2">Proposal Input Form</h1>
      <Progress value={(step / totalSteps) * 100} className="h-2 mb-2" />
      <p className="text-muted-foreground">Step {step} of {totalSteps}</p>

      <Card>
        <CardContent className="grid gap-4 p-4">
          {step === 1 && (
            <>
              <Input placeholder="Project Name" value={formData.projectName} onChange={handleChange("projectName")} />
              <Input placeholder="Project Location (Address, City, State)" value={formData.location} onChange={handleChange("location")} />
              <Input placeholder="Proposal Number" value={formData.proposalNumber} onChange={handleChange("proposalNumber")} />
              <Input type="date" value={formData.proposalDate} onChange={handleChange("proposalDate")} />
            </>
          )}

          {step === 2 && (
            <>
              <Textarea placeholder="Brief Project Description" value={formData.description} onChange={handleChange("description")} />
              <Textarea placeholder="Requested Services (bullet list or paragraph)" value={formData.services} onChange={handleChange("services")} />
            </>
          )}

          {step === 3 && (
            <>
              <Textarea placeholder="Scope of Work (main tasks and subtasks)" value={formData.scope} onChange={handleChange("scope")} />
              <Textarea placeholder="Exclusions" value={formData.exclusions} onChange={handleChange("exclusions")} />
            </>
          )}

          {step === 4 && (
            <>
              <Textarea placeholder="Outside Services (or indicate not anticipated)" value={formData.outsideServices} onChange={handleChange("outsideServices")} />
              <Textarea placeholder="Schedule for Services" value={formData.schedule} onChange={handleChange("schedule")} />
            </>
          )}

          {step === 5 && (
            <>
              <Textarea placeholder="Fee Information (Fee type, total fee, breakdown)" value={formData.feeInfo} onChange={handleChange("feeInfo")} />
              <Textarea placeholder="Attachments & Legal (e.g. Fee Schedule 2025, T&Cs included)" value={formData.attachments} onChange={handleChange("attachments")} />
            </>
          )}

          {step === 6 && (
            <>
              <Textarea placeholder="Notes or Internal Comments" value={formData.notes} onChange={handleChange("notes")} />
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {step > 1 ? <Button onClick={prevStep} variant="outline">Back</Button> : <span />}
        {step < totalSteps ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={generateDocx}>Download .docx Proposal</Button>
        )}
      </div>
    </div>
  );
}


