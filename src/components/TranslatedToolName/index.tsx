import React from 'react';

import { DressingToolsNames } from 'hooks/useRelatedTools';

import translatedToolNames from 'mockdata/pt-br/dressingTools.json';

import { TranslatedToolNameProps } from './interface';

const TranslatedToolName: React.FC<TranslatedToolNameProps> = ({ name }) => {
  const toolName: DressingToolsNames = name.replace(
    /\d+$/,
    '',
  ) as DressingToolsNames;
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
