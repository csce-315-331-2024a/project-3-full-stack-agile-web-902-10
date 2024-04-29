import * as React from 'react';
import { Kitchen } from '@prisma/client';

interface EmailTemplateProps {
    kitchen: Kitchen[]
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    kitchen
}) => (
    <div>
        <h1>Welcome, {kitchen[0].email as string}!</h1>
    </div>
);
