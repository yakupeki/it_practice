using System.Text;
using System.Text.RegularExpressions;

namespace Ycf.DotNet.Core.Text;

public static class StringNormalizer {
  public static string? TrimAndNormalize(string? s) {
    if (s is null) return null;
    var replaced = s.Replace('　', ' ');
    var normalized = replaced.Normalize(NormalizationForm.FormKC).Trim();
    return Regex.Replace(normalized, "\\s+", " ");
  }
}
