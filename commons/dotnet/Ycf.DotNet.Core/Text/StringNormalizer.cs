using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Ycf.DotNet.Core.Text;

public static class StringNormalizer
{
    public static string? TrimAndNormalize(string? s)
    {
        if (s is null) return null;
        var normalized = s.Normalize(NormalizationForm.FormKC).Replace('\u3000', ' ').Trim();
        return Regex.Replace(normalized, "\\s+", " ");
    }
}
