import React from 'react';

import { TranslatedToolNameProps } from './interface';

const TranslatedToolName: React.FC<TranslatedToolNameProps> = ({
  name,
  translatedToolNames,
}) => {
  const toolName = name.replace(/\d+$/, '');
  const translatedToolName =
    translatedToolNames[toolName as keyof typeof translatedToolNames];
  const toolNumber = name.match(/\d+$/);

  return (
    <p>
      {translatedToolName} {toolNumber}
    </p>
  );
};

export default TranslatedToolName;
