import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const MeetingScheduler = ({ socket, projectId, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [agenda, setAgenda] = useState('');

  const handleSchedule = () => {
    if (!date || !time) return;

    const meetingTime = new Date(`${date}T${time}`);
    
    socket.emit('schedule-meeting', {
      projectId,
      time: meetingTime.toISOString(),
      agenda
    });

    socket.emit('send-message', {
      projectId,
      content: `Meeting scheduled for ${meetingTime.toLocaleString()} - ${agenda}`,
      type: 'meeting'
    });

    onClose();
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Schedule Meeting</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Time</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Agenda</label>
          <Input
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="Meeting agenda..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSchedule}>Schedule</Button>
        </div>
      </div>
    </Card>
  );
};

export default MeetingScheduler;