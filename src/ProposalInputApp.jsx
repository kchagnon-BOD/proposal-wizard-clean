
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function ProposalInputApp() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: 'LKB Engineering PLLC Proposal', bold: true, size: 28 })] }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: `Project Name: ${formData.projectName}` }),
            new Paragraph({ text: `Description: ${formData.description}` })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${formData.projectName || 'proposal'}.docx`);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Proposal Wizard</h1>
      <input
        name="projectName"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={handleChange}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <button onClick={generateDocx}>Download Proposal</button>
    </div>
  );
}
