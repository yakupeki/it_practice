using System.ComponentModel;
using System.Windows.Forms;
using Ycf.DotNet.Core.Text;

namespace Ycf.DotNet.Core.WinForms;

public class BaseForm : Form
{
    protected override void OnShown(EventArgs e)
    {
        base.OnShown(e);
        HookTextBoxes(this.Controls);
    }

    private void HookTextBoxes(Control.ControlCollection controls)
    {
        foreach (Control control in controls)
        {
            if (control is TextBox textBox)
            {
                textBox.Validating -= HandleTextBoxValidating;
                textBox.Validating += HandleTextBoxValidating;
            }

            if (control.HasChildren)
            {
                HookTextBoxes(control.Controls);
            }
        }
    }

    private static void HandleTextBoxValidating(object? sender, CancelEventArgs e)
    {
        if (sender is TextBox textBox)
        {
            textBox.Text = StringNormalizer.TrimAndNormalize(textBox.Text) ?? string.Empty;
        }
    }
}
