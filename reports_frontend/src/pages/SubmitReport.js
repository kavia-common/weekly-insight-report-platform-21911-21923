import React, { useState } from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';
import Button from '../components/common/Button';

export default function SubmitReport() {
  const [form, setForm] = useState({ title: '', accomplishments: '', blockers: '', plans: '' });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit (no Supabase integration yet)
    alert('Report captured locally. Integration pending.');
  };

  return (
    <div className="container">
      <h2>Submit Report</h2>
      <p className="text-muted">Record highlights, challenges, and next week’s goals.</p>

      <Card>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <Input label="Title" placeholder="e.g., Week 42 Summary" value={form.title} onChange={update('title')} />
          <TextArea label="Accomplishments" placeholder="What did you achieve?" rows={4} value={form.accomplishments} onChange={update('accomplishments')} />
          <TextArea label="Blockers" placeholder="What impeded your progress?" rows={4} value={form.blockers} onChange={update('blockers')} />
          <TextArea label="Plans" placeholder="What will you do next week?" rows={4} value={form.plans} onChange={update('plans')} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" type="submit" aria-label="Submit weekly report">Submit</Button>
            <Button variant="ghost" type="button" onClick={() => setForm({ title: '', accomplishments: '', blockers: '', plans: '' })}>Reset</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
