import React, { useState, useEffect, useRef } from "react";
import "../styles/QuestionForm.css";

const CaseGroup = ({ title, data, setData, type = "sample" }) => {
  const add = () => setData([...data, { input: "", output: "", explanation: "" }]);
  
  const edit = (i, k, v) =>
    setData(data.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
  
  const remove = (i) => {
    setData(data.filter((_, idx) => idx !== i));
  };

  return (
    <fieldset className={`qf-cases ${type}`}>
      <legend>{title}</legend>
      {data.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: 'var(--text-light)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--bg-light)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {type === 'sample' ? '👁️' : '🔒'}
          </div>
          <p>No {type} test cases yet</p>
          <button 
            type="button" 
            className="qf-add-case" 
            onClick={add}
            style={{ marginTop: '1rem', maxWidth: '200px' }}
          >
            Add First Case
          </button>
        </div>
      ) : (
        <>
          {data.map((c, i) => (
            <div key={i} className="qf-case-row">
              <div className="qf-case-input">
                <div className="qf-case-label">Input</div>
                <textarea
                  className="qf-case-textarea"
                  placeholder={`Input for test case ${i + 1}...`}
                  value={c.input}
                  onChange={(e) => edit(i, "input", e.target.value)}
                />
              </div>
              <div className="qf-case-output">
                <div className="qf-case-label">Expected Output</div>
                <textarea
                  className="qf-case-textarea"
                  placeholder={`Expected output for test case ${i + 1}...`}
                  value={c.output}
                  onChange={(e) => edit(i, "output", e.target.value)}
                />
              </div>
              <button 
                type="button" 
                className="qf-case-remove" 
                onClick={() => remove(i)}
                title={`Remove test case ${i + 1}`}
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" className="qf-add-case" onClick={add}>
            Add Another {type === 'sample' ? 'Sample' : 'Hidden'} Case
          </button>
        </>
      )}
    </fieldset>
  );
};

const TagInput = ({ tags, setTags }) => {
  const [tagInput, setTagInput] = useState('');
  
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const suggestedTags = [
    'array', 'string', 'hash-table', 'math', 'dynamic-programming',
    'sorting', 'greedy', 'database', 'binary-search', 'tree',
    'depth-first-search', 'binary-tree', 'breadth-first-search',
    'two-pointers', 'recursion', 'stack', 'simulation', 'heap',
    'counting', 'sliding-window', 'design', 'backtracking',
    'graph', 'matrix', 'bit-manipulation', 'monotonic-stack'
  ];

  return (
    <div className="qf-tags">
      <div className="qf-tag-input-wrapper">
        <input
          className="qf-tag-input"
          placeholder="Add tags (algorithms, data structures, concepts...)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="qf-tag-add"
          onClick={addTag}
          disabled={!tagInput.trim()}
        >
          Add Tag
        </button>
      </div>

      {tags.length > 0 && (
        <div className="qf-tag-list">
          {tags.map(tag => (
            <span key={tag} className="qf-tag">
              {tag}
              <button
                type="button"
                className="qf-tag-remove"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          Popular tags:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {suggestedTags.slice(0, 10).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (!tags.includes(tag)) {
                  setTags([...tags, tag]);
                }
              }}
              disabled={tags.includes(tag)}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                border: '1px solid var(--bg-medium)',
                borderRadius: '1rem',
                background: tags.includes(tag) ? 'var(--bg-medium)' : 'transparent',
                color: tags.includes(tag) ? 'var(--text-light)' : 'var(--text-secondary)',
                cursor: tags.includes(tag) ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-speed)'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditorialSection = ({ editorial, setEditorial }) => {
  return (
    <div>
      <label className="qf-label">
        Editorial/Solution Explanation
        <textarea
          className="qf-text"
          rows={6}
          placeholder="Provide a detailed explanation of the solution approach, algorithms used, time/space complexity analysis..."
          value={editorial}
          onChange={(e) => setEditorial(e.target.value)}
        />
      </label>
    </div>
  );
};

const SolutionCode = ({ solutions, setSolutions }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  
  const languages = [
    { id: 'python', name: 'Python', ext: 'py' },
    { id: 'javascript', name: 'JavaScript', ext: 'js' },
    { id: 'java', name: 'Java', ext: 'java' },
    { id: 'cpp', name: 'C++', ext: 'cpp' },
    { id: 'c', name: 'C', ext: 'c' }
  ];

  const updateSolution = (lang, code) => {
    setSolutions(prev => ({ ...prev, [lang]: code }));
  };

  return (
    <div>
      <label className="qf-label">
        Reference Solutions
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {languages.map(lang => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                border: '2px solid var(--bg-medium)',
                borderRadius: 'var(--border-radius-sm)',
                background: selectedLanguage === lang.id ? 'var(--primary-color)' : 'transparent',
                color: selectedLanguage === lang.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-speed)'
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
        <textarea
          className="qf-text"
          rows={12}
          placeholder={`Write your ${languages.find(l => l.id === selectedLanguage)?.name} solution here...`}
          value={solutions[selectedLanguage] || ''}
          onChange={(e) => updateSolution(selectedLanguage, e.target.value)}
          style={{ 
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            fontSize: '0.85rem'
          }}
        />
      </label>
    </div>
  );
};

export default function QuestionForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "medium");
  const [category, setCategory] = useState(initialData?.category || "algorithms");
  const [pts, setPts] = useState(initialData?.points || 100);
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 1000);
  const [memoryLimit, setMemoryLimit] = useState(initialData?.memoryLimit || 256);
  const [sample, setSample] = useState(initialData?.sampleTestCases || []);
  const [hidden, setHidden] = useState(initialData?.hiddenTestCases || []);
  const [tags, setTags] = useState(initialData?.tags || []);
  const [hints, setHints] = useState(initialData?.hints || []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [constraints, setConstraints] = useState(initialData?.constraints || "");
  const [followUp, setFollowUp] = useState(initialData?.followUp || "");
  const [editorial, setEditorial] = useState(initialData?.editorial || "");
  const [solutions, setSolutions] = useState(initialData?.solutions || {});
  const [authorNotes, setAuthorNotes] = useState(initialData?.authorNotes || "");
  
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSolutions, setShowSolutions] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    // Calculate form completion progress
    const fields = [
      title, 
      desc, 
      difficulty, 
      category, 
      pts, 
      sample.length > 0, 
      hidden.length > 0,
      timeLimit,
      memoryLimit
    ];
    const completed = fields.filter(Boolean).length;
    setFormProgress((completed / fields.length) * 100);

    // Validate form
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (title.length > 100) errors.title = "Title must be less than 100 characters";
    if (!desc.trim()) errors.desc = "Description is required";
    if (desc.length < 50) errors.desc = "Description should be at least 50 characters";
    if (sample.length === 0) errors.sample = "At least one sample test case is required";
    if (hidden.length === 0) errors.hidden = "At least one hidden test case is required";
    if (pts < 1 || pts > 1000) errors.pts = "Points must be between 1 and 1000";
    if (timeLimit < 100 || timeLimit > 10000) errors.timeLimit = "Time limit must be between 100ms and 10000ms";
    if (memoryLimit < 16 || memoryLimit > 1024) errors.memoryLimit = "Memory limit must be between 16MB and 1024MB";
    
    // Validate test cases
    const allCases = [...sample, ...hidden];
    const invalidCases = allCases.some(c => !c.input.trim() || !c.output.trim());
    if (invalidCases) errors.testCases = "All test cases must have input and output";

    // Check for duplicate test cases
    const caseStrings = allCases.map(c => c.input.trim() + '|' + c.output.trim());
    const uniqueCases = new Set(caseStrings);
    if (uniqueCases.size !== caseStrings.length) {
      errors.duplicateCases = "Duplicate test cases found";
    }

    setValidationErrors(errors);
  }, [title, desc, difficulty, category, pts, timeLimit, memoryLimit, sample, hidden]);

  const ready = Object.keys(validationErrors).length === 0 && title && desc;

  const categories = [
    { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
    { id: 'data-structures', name: 'Data Structures', icon: '🏗️' },
    { id: 'math', name: 'Mathematics', icon: '🧮' },
    { id: 'string', name: 'String Processing', icon: '📝' },
    { id: 'graph', name: 'Graph Theory', icon: '🕸️' },
    { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🎯' },
    { id: 'greedy', name: 'Greedy', icon: '🎪' },
    { id: 'backtracking', name: 'Backtracking', icon: '🔄' },
    { id: 'simulation', name: 'Simulation', icon: '🎮' },
    { id: 'implementation', name: 'Implementation', icon: '⚙️' },
    { id: 'sorting', name: 'Sorting', icon: '📊' },
    { id: 'searching', name: 'Searching', icon: '🔍' },
    { id: 'geometry', name: 'Geometry', icon: '📐' },
    { id: 'number-theory', name: 'Number Theory', icon: '🔢' }
  ];

  const addHint = () => {
    setHints([...hints, ""]);
  };

  const updateHint = (index, value) => {
    const newHints = [...hints];
    newHints[index] = value;
    setHints(newHints);
  };

  const removeHint = (index) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const getComplexityFromConstraints = () => {
    if (!constraints) return "Not specified";
    
    // Simple heuristic to suggest time complexity
    if (constraints.includes("10^9") || constraints.includes("10^8")) return "O(log n) or O(1)";
    if (constraints.includes("10^5")) return "O(n log n) or O(n)";
    if (constraints.includes("10^4")) return "O(n²) acceptable";
    if (constraints.includes("10^3")) return "O(n³) acceptable";
    return "Analyze based on constraints";
  };

  const handlePreview = () => {
    const previewData = {
      title, desc, difficulty, category, points: pts,
      timeLimit, memoryLimit, constraints, followUp,
      sampleTestCases: sample, hiddenTestCases: hidden,
      tags, hints, editorial, solutions, authorNotes
    };
    
    const previewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Problem Preview: ${title}</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              max-width: 900px; 
              margin: 2rem auto; 
              padding: 0 2rem; 
              line-height: 1.6;
              color: #1e293b;
            }
            .header { 
              border-bottom: 3px solid #e2e8f0; 
              padding-bottom: 1.5rem; 
              margin-bottom: 2rem; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 2rem;
              border-radius: 1rem;
              margin: -1rem -2rem 2rem -2rem;
            }
            .difficulty { 
              padding: 0.5rem 1rem; 
              border-radius: 1.5rem; 
              font-weight: 600; 
              font-size: 0.9rem; 
              display: inline-block;
              margin-right: 1rem;
            }
            .easy { background: #dcfce7; color: #166534; }
            .medium { background: #fef3c7; color: #a16207; }
            .hard { background: #fecaca; color: #991b1b; }
            .section { 
              margin: 2.5rem 0; 
              padding: 1.5rem;
              background: #f8fafc;
              border-radius: 1rem;
              border-left: 4px solid #7c3aed;
            }
            .test-case { 
              background: white; 
              padding: 1.5rem; 
              border-radius: 0.75rem; 
              margin: 1rem 0; 
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            pre { 
              background: #1e293b; 
              color: #f1f5f9; 
              padding: 1rem; 
              border-radius: 0.5rem; 
              overflow-x: auto; 
              font-size: 0.9rem;
            }
            .meta-info {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              margin: 1rem 0;
            }
            .meta-card {
              background: white;
              padding: 1rem;
              border-radius: 0.75rem;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 0.5rem;
            }
            .tag {
              background: #7c3aed;
              color: white;
              padding: 0.3rem 0.8rem;
              border-radius: 1rem;
              font-size: 0.8rem;
              font-weight: 500;
            }
            h1 { margin: 0 0 1rem 0; font-size: 2.5rem; }
            h2 { color: #475569; margin-bottom: 1rem; }
            .complexity-hint {
              background: #ede9fe;
              color: #5b21b6;
              padding: 0.75rem 1rem;
              border-radius: 0.5rem;
              margin-top: 1rem;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div>
              <span class="difficulty ${difficulty}">${difficulty.toUpperCase()}</span>
              <span style="font-size: 1.1rem; opacity: 0.9;">${pts} points • ${category}</span>
            </div>
            ${tags.length > 0 ? `
              <div class="tags" style="margin-top: 1rem;">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="meta-info">
            <div class="meta-card">
              <strong>⏱️ Time Limit</strong><br>
              ${timeLimit}ms
            </div>
            <div class="meta-card">
              <strong>💾 Memory Limit</strong><br>
              ${memoryLimit}MB
            </div>
            <div class="meta-card">
              <strong>🧪 Test Cases</strong><br>
              ${sample.length} sample + ${hidden.length} hidden
            </div>
            <div class="meta-card">
              <strong>🎯 Suggested Complexity</strong><br>
              ${getComplexityFromConstraints()}
            </div>
          </div>

          <div class="section">
            <h2>📋 Problem Description</h2>
            <div style="white-space: pre-line; font-size: 1rem;">${desc}</div>
          </div>

          ${constraints ? `
            <div class="section">
              <h2>⚖️ Constraints</h2>
              <pre>${constraints}</pre>
              <div class="complexity-hint">
                💡 Suggested Time Complexity: ${getComplexityFromConstraints()}
              </div>
            </div>
          ` : ''}

          <div class="section">
            <h2>📝 Sample Test Cases</h2>
            ${sample.map((tc, i) => `
              <div class="test-case">
                <h3 style="margin-top: 0; color: #7c3aed;">Example ${i + 1}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <strong>Input:</strong>
                    <pre>${tc.input}</pre>
                  </div>
                  <div>
                    <strong>Output:</strong>
                    <pre>${tc.output}</pre>
                  </div>
                </div>
                ${tc.explanation ? `
                  <div style="margin-top: 1rem;">
                    <strong>Explanation:</strong><br>
                    ${tc.explanation}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          ${hints.filter(h => h.trim()).length > 0 ? `
            <div class="section">
              <h2>💡 Hints</h2>
              <ol style="margin: 0; padding-left: 1.5rem;">
                ${hints.filter(h => h.trim()).map(hint => `<li style="margin: 0.5rem 0;">${hint}</li>`).join('')}
              </ol>
            </div>
          ` : ''}

          ${editorial ? `
            <div class="section">
              <h2>📖 Editorial</h2>
              <div style="white-space: pre-line;">${editorial}</div>
            </div>
          ` : ''}

          ${followUp ? `
            <div class="section">
              <h2>🚀 Follow-up Questions</h2>
              <div style="white-space: pre-line;">${followUp}</div>
            </div>
          ` : ''}

          ${Object.keys(solutions).length > 0 ? `
            <div class="section">
              <h2>💻 Reference Solutions</h2>
              ${Object.entries(solutions).filter(([lang, code]) => code.trim()).map(([lang, code]) => `
                <div style="margin-bottom: 1.5rem;">
                  <h3>${lang.charAt(0).toUpperCase() + lang.slice(1)}</h3>
                  <pre>${code}</pre>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${authorNotes ? `
            <div class="section">
              <h2>👨‍💼 Author Notes</h2>
              <div style="white-space: pre-line; font-style: italic;">${authorNotes}</div>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 3rem; padding: 2rem; background: #f1f5f9; border-radius: 1rem;">
            <p style="color: #64748b; margin: 0;">
              Generated by Contest Creation Platform • ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  const validateTestCase = (testCase) => {
    return testCase.input.trim() && testCase.output.trim();
  };

  const handleSave = () => {
    if (!ready) return;

    const problemData = {
      title: title.trim(),
      description: desc.trim(),
      difficulty,
      category,
      points: pts,
      timeLimit,
      memoryLimit,
      constraints: constraints.trim(),
      followUp: followUp.trim(),
      sampleTestCases: sample.filter(validateTestCase),
      hiddenTestCases: hidden.filter(validateTestCase),
      tags: tags.filter(tag => tag.trim()),
      hints: hints.filter(h => h.trim()),
      editorial: editorial.trim(),
      solutions: Object.fromEntries(
        Object.entries(solutions).filter(([lang, code]) => code.trim())
      ),
      authorNotes: authorNotes.trim(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    onSave(problemData);
  };

  return (
    <div className="qf-wrapper" ref={formRef}>
      <h3>{initialData ? "Edit Problem" : "Create New Problem"}</h3>

      <div className="qf-progress">
        <div 
          className="qf-progress-bar" 
          style={{ width: `${formProgress}%` }}
        ></div>
      </div>
      <p style={{ 
        fontSize: '0.8rem', 
        color: 'var(--text-light)', 
        margin: '0.5rem 0 1.5rem 0',
        textAlign: 'center'
      }}>
        {Math.round(formProgress)}% Complete
      </p>

      {/* Basic Information */}
      <div className="qf-form-grid">
        <div>
          <label className="qf-label required">
            Problem Title
            <input
              className={`qf-input ${validationErrors.title ? 'qf-field-error' : title ? 'qf-field-success' : ''}`}
              placeholder="e.g. Two Sum, Binary Tree Traversal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            {validationErrors.title ? (
              <div className="qf-error-message">{validationErrors.title}</div>
            ) : title && !validationErrors.title ? (
              <div className="qf-success-message">Good title!</div>
            ) : null}
          </label>
        </div>

        <div>
          <label className="qf-label required">
            Points
            <input
              type="number"
              className={`qf-input ${validationErrors.pts ? 'qf-field-error' : ''}`}
              min={1}
              max={1000}
              value={pts}
              onChange={(e) => setPts(Number(e.target.value))}
            />
            {validationErrors.pts && (
              <div className="qf-error-message">{validationErrors.pts}</div>
            )}
          </label>
        </div>
      </div>

      <label className="qf-label required">
        Problem Description
        <textarea
          className={`qf-text ${validationErrors.desc ? 'qf-field-error' : desc.length >= 50 ? 'qf-field-success' : ''}`}
          rows={6}
          placeholder="Describe the problem clearly. Include input/output format, examples, and any special requirements. Markdown formatting is supported."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          {validationErrors.desc ? (
            <div className="qf-error-message">{validationErrors.desc}</div>
          ) : desc.length >= 50 ? (
            <div className="qf-success-message">Good description length!</div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              {desc.length < 50 ? `${50 - desc.length} characters needed` : ''}
            </div>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            {desc.length}/2000
          </span>
        </div>
      </label>

      {/* Category and Difficulty */}
      <div className="qf-select-row">
        <label className="qf-label">
          Difficulty
          <select
            className="qf-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">🟢 Easy (Beginner friendly)</option>
            <option value="medium">🟡 Medium (Intermediate level)</option>
            <option value="hard">🔴 Hard (Advanced concepts)</option>
          </select>
        </label>

        <label className="qf-label">
          Category
          <select
            className="qf-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Test Cases */}
      <CaseGroup 
        title="Sample Test Cases (Visible to contestants)"
        data={sample} 
        setData={setSample} 
        type="sample"
      />
      {validationErrors.sample && (
        <div className="qf-error-message" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
          {validationErrors.sample}
        </div>
      )}

      <CaseGroup 
        title="Hidden Test Cases (For evaluation)"
        data={hidden} 
        setData={setHidden} 
        type="hidden"
      />
      {validationErrors.hidden && (
        <div className="qf-error-message" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
          {validationErrors.hidden}
        </div>
      )}
      {validationErrors.testCases && (
        <div className="qf-error-message" style={{ marginBottom: '1rem' }}>
          {validationErrors.testCases}
        </div>
      )}
      {validationErrors.duplicateCases && (
        <div className="qf-error-message" style={{ marginBottom: '1rem' }}>
          {validationErrors.duplicateCases}
        </div>
      )}

      {/* Tags */}
      <label className="qf-label">
        Tags
        <TagInput tags={tags} setTags={setTags} />
      </label>

      {/* Advanced Settings */}
      <div className="qf-advanced">
        <div 
          className={`qf-advanced-toggle ${showAdvanced ? 'expanded' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced Settings & Performance Tuning
        </div>
        
        <div className={`qf-advanced-content ${showAdvanced ? 'show' : ''}`}>
          {/* Time and Memory Limits */}
          <div className="qf-constraints-grid">
            <label className="qf-label">
              Time Limit (ms)
              <input
                type="number"
                className={`qf-input ${validationErrors.timeLimit ? 'qf-field-error' : ''}`}
                min={100}
                max={10000}
                step={100}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
              {validationErrors.timeLimit && (
                <div className="qf-error-message">{validationErrors.timeLimit}</div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                Typical: 1000ms for most problems
              </div>
            </label>

            <label className="qf-label">
              Memory Limit (MB)
              <input
                type="number"
                className={`qf-input ${validationErrors.memoryLimit ? 'qf-field-error' : ''}`}
                min={16}
                max={1024}
                step={16}
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
              />
              {validationErrors.memoryLimit && (
                <div className="qf-error-message">{validationErrors.memoryLimit}</div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                Typical: 256MB for most problems
              </div>
            </label>
          </div>

          {/* Constraints */}
          <label className="qf-label">
            Constraints & Input Format
            <textarea
              className="qf-text"
              rows={4}
              placeholder="e.g. 1 ≤ n ≤ 10^5&#10;-10^9 ≤ arr[i] ≤ 10^9&#10;1 ≤ queries ≤ 10^4&#10;All integers are 32-bit signed"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              💡 Suggested complexity for these constraints: {getComplexityFromConstraints()}
            </div>
          </label>

          {/* Hints */}
          <label className="qf-label">
            Hints (Optional)
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
              Provide progressive hints to help contestants solve the problem
            </div>
            {hints.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '1.5rem', 
                background: 'var(--bg-light)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
                <p style={{ margin: 0, color: 'var(--text-light)' }}>No hints added yet</p>
                <button
                  type="button"
                  className="qf-add-case"
                  onClick={addHint}
                  style={{ marginTop: '1rem', maxWidth: '200px' }}
                >
                  Add First Hint
                </button>
              </div>
            ) : (
              <>
                {hints.map((hint, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ 
                      minWidth: '24px', 
                      height: '24px', 
                      background: 'var(--primary-color)', 
                      color: 'white', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      marginTop: '0.5rem'
                    }}>
                      {i + 1}
                    </div>
                    <textarea
                      className="qf-text"
                      placeholder={`Hint ${i + 1}: Provide a helpful hint without giving away the complete solution...`}
                      value={hint}
                      onChange={(e) => updateHint(i, e.target.value)}
                      rows={2}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="qf-case-remove"
                      onClick={() => removeHint(i)}
                      style={{ width: '40px', height: '40px', marginTop: '0.25rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="qf-add-case"
                  onClick={addHint}
                  style={{ marginTop: '0.75rem' }}
                >
                  ➕ Add Another Hint
                </button>
              </>
            )}
          </label>

          {/* Follow-up Questions */}
          <label className="qf-label">
            Follow-up Questions
            <textarea
              className="qf-text"
              rows={3}
              placeholder="What if the constraints were larger? How would you optimize further? Can you solve it with O(1) extra space?"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              Extensions or variations to challenge advanced contestants
            </div>
          </label>

          {/* Author Notes */}
          <label className="qf-label">
            Author Notes (Internal)
            <textarea
              className="qf-text"
              rows={2}
              placeholder="Internal notes for contest organizers, solution approach, edge cases to watch for..."
              value={authorNotes}
              onChange={(e) => setAuthorNotes(e.target.value)}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              Only visible to contest organizers
            </div>
          </label>
        </div>
      </div>

      {/* Editorial and Solutions Section */}
      <div className="qf-advanced">
        <div 
          className={`qf-advanced-toggle ${showSolutions ? 'expanded' : ''}`}
          onClick={() => setShowSolutions(!showSolutions)}
        >
          Editorial & Reference Solutions
        </div>
        
        <div className={`qf-advanced-content ${showSolutions ? 'show' : ''}`}>
          <EditorialSection editorial={editorial} setEditorial={setEditorial} />
          <SolutionCode solutions={solutions} setSolutions={setSolutions} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="qf-actions">
        <button 
          className="qf-preview-btn" 
          onClick={handlePreview}
          disabled={!title || !desc}
        >
          👀 Preview Problem
        </button>
        
        <button 
          className="cc-btn ghost" 
          onClick={onCancel}
        >
          Cancel
        </button>
        
        <button
          className="cc-btn primary"
          disabled={!ready}
          onClick={handleSave}
        >
          {ready ? (
            <span className="cc-success">
              ✅ {initialData ? 'Update' : 'Save'} Problem
            </span>
          ) : (
            `${initialData ? 'Update' : 'Save'} Problem`
          )}
        </button>
      </div>

      {/* Progress Summary */}
      {formProgress < 100 && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(124, 58, 237, 0.1)', 
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid rgba(124, 58, 237, 0.2)'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            📋 Completion Checklist
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {!title && '• Add a problem title\n'}
            {!desc && '• Write problem description\n'}
            {sample.length === 0 && '• Add sample test cases\n'}
            {hidden.length === 0 && '• Add hidden test cases\n'}
            {Object.keys(validationErrors).length > 0 && '• Fix validation errors\n'}
          </div>
        </div>
      )}
    </div>
  );
}