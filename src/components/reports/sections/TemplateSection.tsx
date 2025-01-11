import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ReportFormula } from "../FormulaBuilder";

interface TemplateSectionProps {
  selectedFields: string[];
  formulas: ReportFormula[];
  selectedFormat: "pdf" | "excel";
  onLoadTemplate: (template: any) => void;
}

export const TemplateSection = ({ 
  selectedFields, 
  formulas, 
  selectedFormat,
  onLoadTemplate 
}: TemplateSectionProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSaveTemplate = async () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field');
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user?.id) {
        toast.error('You must be logged in to save templates');
        return;
      }

      const { error } = await supabase
        .from('report_templates')
        .insert({
          name: `Report Template ${new Date().toLocaleDateString()}`,
          fields: selectedFields,
          formulas: formulas,
          format: selectedFormat,
          user_id: session.user.id
        });

      if (error) throw error;
      toast.success('Template saved successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  return { templates, isLoadingTemplates, handleSaveTemplate };
};