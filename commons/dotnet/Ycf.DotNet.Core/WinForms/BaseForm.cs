using System.ComponentModel;
using System.Windows.Forms;
using Ycf.DotNet.Core.Text;

namespace Ycf.DotNet.Core.WinForms;

public class BaseForm : Form {
  protected override void OnShown(System.EventArgs e) {
    base.OnShown(e);
    HookTextBoxes(this.Controls);
  }
  private static void HookTextBoxes(Control.ControlCollection controls) {
    foreach (Control c in controls) {
      if (c is TextBox tb) tb.Validating += NormalizeText;
      if (c.HasChildren) HookTextBoxes(c.Controls);
    }
  }
  private static void NormalizeText(object? sender, CancelEventArgs e) {
    if (sender is TextBox tb) tb.Text = StringNormalizer.TrimAndNormalize(tb.Text) ?? string.Empty;
  }
}
