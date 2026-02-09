import type { Result } from "../../../domain/index.js";
import { DataSection } from "./DataSection.js";
import { SettingsSection } from "./SettingsSection.js";

type Props = {
  readonly initialBackend: string;
  readonly onSave: (backend: string) => Promise<void>;
  readonly onExport: () => Promise<Result<void, string>>;
  readonly onImport: (file: File) => Promise<Result<void, string>>;
};

export const OptionsApp = ({ initialBackend, onSave, onExport, onImport }: Props) => (
  <>
    <SettingsSection initialBackend={initialBackend} onSave={onSave} />
    <DataSection onExport={onExport} onImport={onImport} />
  </>
);
